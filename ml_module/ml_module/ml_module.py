import os

import pandas as pd
import torch
from sentence_transformers import SentenceTransformer, util


class RegionSearchML:
    def __init__(self, csv_path: str):
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        full_path = os.path.join(base_dir, csv_path)

        if not os.path.exists(full_path):
            raise FileNotFoundError(f"Файл не найден: {full_path}")

        self.df = pd.read_csv(full_path, sep=";", encoding="utf-8")

        required_columns = [
            "region_name",
            "tags",
            "full_description_for_ml",
        ]

        for column in required_columns:
            if column not in self.df.columns:
                raise ValueError(f"В CSV нет обязательной колонки: {column}")

        self.model = SentenceTransformer(
            "paraphrase-multilingual-MiniLM-L12-v2"
        )

        descriptions = (
            self.df["full_description_for_ml"]
            .fillna("")
            .astype(str)
            .tolist()
        )

        self.region_embeddings = self.model.encode(
            descriptions,
            convert_to_tensor=True,
        )

    def search(
        self,
        user_query: str,
        selected_tags: list[str] | None = None,
        top_k: int = 6,
    ) -> list[dict]:
        user_query = user_query.strip()

        if not user_query:
            return []

        if top_k is None:
            top_k = 6

        top_k = max(1, min(int(top_k), len(self.df)))

        query_embedding = self.model.encode(
            user_query,
            convert_to_tensor=True,
        )

        cosine_scores = util.cos_sim(
            query_embedding,
            self.region_embeddings,
        )[0]

        query_words = user_query.lower().split()
        final_scores = cosine_scores.clone()

        for i in range(len(self.df)):
            tag_bonus = 0.0

            if selected_tags:
                region_tags = str(self.df.iloc[i]["tags"]).lower()

                for tag in selected_tags:
                    if str(tag).lower() in region_tags:
                        tag_bonus += 0.25

            description = str(
                self.df.iloc[i]["full_description_for_ml"]
            ).lower()

            region_name = str(
                self.df.iloc[i]["region_name"]
            ).lower()

            word_boost = 0.0

            for word in query_words:
                if len(word) < 3:
                    continue

                if word in region_name:
                    word_boost += 0.6
                elif word in description:
                    word_boost += 0.3

            final_scores[i] = (
                float(cosine_scores[i])
                + word_boost
                + tag_bonus
            )

        top_results = torch.topk(final_scores, k=top_k)

        results = []

        for score, idx in zip(top_results.values, top_results.indices):
            res_idx = int(idx)

            results.append(
                {
                    "region": self.df.iloc[res_idx]["region_name"],
                    "score": round(float(score), 4),
                    "tags": self.df.iloc[res_idx]["tags"],
                    "description": self.df.iloc[res_idx][
                        "full_description_for_ml"
                    ],
                }
            )

        return results