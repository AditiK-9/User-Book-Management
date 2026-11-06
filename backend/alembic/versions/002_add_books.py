"""Add books table

Revision ID: 002
Revises: 001
Create Date: 2026-03-13

"""
from alembic import op
import sqlalchemy as sa

revision = '002'
down_revision = '001'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'books',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(), nullable=False),
        sa.Column('author', sa.String(), nullable=False),
        sa.Column('published_date', sa.String(), nullable=True),
        sa.Column('isbn', sa.String(), nullable=True),
        sa.Column('genre', sa.String(), nullable=True),
        sa.Column('description', sa.String(), nullable=True),
        sa.Column('assigned_user_id', sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(['assigned_user_id'], ['users.id'], ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_books_id'), 'books', ['id'], unique=False)


def downgrade():
    op.drop_index(op.f('ix_books_id'), table_name='books')
    op.drop_table('books')
