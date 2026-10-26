"""Initial PostgreSQL schema for OmniCreator SaaS

Revision ID: 001_initial_schema
Revises: 
Create Date: 2026-10-01 20:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = '001_initial_schema'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    # 1. users table
    op.create_table(
        'users',
        sa.Column('id', sa.String(length=36), primary_key=True),
        sa.Column('email', sa.String(length=255), nullable=False, unique=True),
        sa.Column('hashed_password', sa.String(length=255), nullable=True),
        sa.Column('full_name', sa.String(length=255), nullable=True, default='Creator'),
        sa.Column('is_active', sa.Boolean(), default=True),
        sa.Column('subscription_tier', sa.String(length=50), default='free'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)

    # 2. projects table
    op.create_table(
        'projects',
        sa.Column('id', sa.String(length=36), primary_key=True),
        sa.Column('user_id', sa.String(length=36), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('target_audience', sa.String(length=255), nullable=True),
        sa.Column('tone', sa.String(length=100), default='Professional'),
        sa.Column('primary_goal', sa.String(length=100), default='Growth'),
        sa.Column('status', sa.String(length=50), default='active'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index(op.f('ix_projects_user_id'), 'projects', ['user_id'], unique=False)

    # 3. assets table
    op.create_table(
        'assets',
        sa.Column('id', sa.String(length=36), primary_key=True),
        sa.Column('project_id', sa.String(length=36), sa.ForeignKey('projects.id', ondelete='CASCADE'), nullable=False),
        sa.Column('user_id', sa.String(length=36), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('type', sa.String(length=50), nullable=False),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('storage_ref', sa.String(length=512), nullable=True),
        sa.Column('meta_info', sa.JSON(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index(op.f('ix_assets_project_id'), 'assets', ['project_id'], unique=False)
    op.create_index(op.f('ix_assets_user_id'), 'assets', ['user_id'], unique=False)

    # 4. ai_generations table
    op.create_table(
        'ai_generations',
        sa.Column('id', sa.String(length=36), primary_key=True),
        sa.Column('project_id', sa.String(length=36), sa.ForeignKey('projects.id', ondelete='CASCADE'), nullable=False),
        sa.Column('user_id', sa.String(length=36), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('tool', sa.String(length=100), nullable=False),
        sa.Column('provider', sa.String(length=50), nullable=False),
        sa.Column('model', sa.String(length=100), nullable=False),
        sa.Column('input_data', sa.JSON(), nullable=False),
        sa.Column('output_data', sa.JSON(), nullable=False),
        sa.Column('input_tokens', sa.Integer(), nullable=True),
        sa.Column('output_tokens', sa.Integer(), nullable=True),
        sa.Column('total_tokens', sa.Integer(), nullable=True),
        sa.Column('latency_ms', sa.Integer(), nullable=True),
        sa.Column('status', sa.String(length=50), default='completed'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index(op.f('ix_ai_generations_project_id'), 'ai_generations', ['project_id'], unique=False)
    op.create_index(op.f('ix_ai_generations_user_id'), 'ai_generations', ['user_id'], unique=False)

    # 5. usage_records table
    op.create_table(
        'usage_records',
        sa.Column('id', sa.String(length=36), primary_key=True),
        sa.Column('user_id', sa.String(length=36), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('project_id', sa.String(length=36), sa.ForeignKey('projects.id', ondelete='CASCADE'), nullable=False),
        sa.Column('generation_id', sa.String(length=36), sa.ForeignKey('ai_generations.id', ondelete='CASCADE'), nullable=False),
        sa.Column('tool', sa.String(length=100), nullable=False),
        sa.Column('provider', sa.String(length=50), nullable=False),
        sa.Column('model', sa.String(length=100), nullable=False),
        sa.Column('input_tokens', sa.Integer(), nullable=True),
        sa.Column('output_tokens', sa.Integer(), nullable=True),
        sa.Column('total_tokens', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index(op.f('ix_usage_records_user_id'), 'usage_records', ['user_id'], unique=False)
    op.create_index(op.f('ix_usage_records_project_id'), 'usage_records', ['project_id'], unique=False)

def downgrade() -> None:
    op.drop_table('usage_records')
    op.drop_table('ai_generations')
    op.drop_table('assets')
    op.drop_table('projects')
    op.drop_table('users')
