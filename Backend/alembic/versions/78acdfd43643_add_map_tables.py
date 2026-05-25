"""add map tables

Revision ID: 78acdfd43643
Revises: 1fde270a5e4b
Create Date: 2026-05-25 10:06:05.559077

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "78acdfd43643"
down_revision: Union[str, Sequence[str], None] = "1fde270a5e4b"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "regions",
        sa.Column("id", sa.String(), nullable=False),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("sights", sa.JSON(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_index(
        op.f("ix_regions_id"),
        "regions",
        ["id"],
        unique=False,
    )

    op.create_index(
        op.f("ix_regions_name"),
        "regions",
        ["name"],
        unique=True,
    )

    op.create_table(
        "visited_regions",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("region_id", sa.String(), nullable=False),
        sa.Column("visited_by_route", sa.Boolean(), nullable=True),
        sa.Column("selected_sights", sa.JSON(), nullable=False),
        sa.Column("review_text", sa.Text(), nullable=True),
        sa.Column("rating", sa.Integer(), nullable=True),
        sa.Column("photos", sa.JSON(), nullable=False),
        sa.Column("suggestion", sa.Text(), nullable=True),
        sa.Column("visited_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(
            ["region_id"],
            ["regions.id"],
            ondelete="CASCADE",
        ),
        sa.ForeignKeyConstraint(
            ["user_id"],
            ["users.id"],
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_index(
        op.f("ix_visited_regions_id"),
        "visited_regions",
        ["id"],
        unique=False,
    )

    op.create_index(
        op.f("ix_visited_regions_region_id"),
        "visited_regions",
        ["region_id"],
        unique=False,
    )

    op.create_index(
        op.f("ix_visited_regions_user_id"),
        "visited_regions",
        ["user_id"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index(
        op.f("ix_visited_regions_user_id"),
        table_name="visited_regions",
    )

    op.drop_index(
        op.f("ix_visited_regions_region_id"),
        table_name="visited_regions",
    )

    op.drop_index(
        op.f("ix_visited_regions_id"),
        table_name="visited_regions",
    )

    op.drop_table("visited_regions")

    op.drop_index(
        op.f("ix_regions_name"),
        table_name="regions",
    )

    op.drop_index(
        op.f("ix_regions_id"),
        table_name="regions",
    )

    op.drop_table("regions")