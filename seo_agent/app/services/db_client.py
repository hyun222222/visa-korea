from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy.sql import func
from ..core.config import Config

Base = declarative_base()

class ResearchRecord(Base):
    """Table to store research results."""
    __tablename__ = 'research_records'
    
    id = Column(Integer, primary_key=True)
    keyword = Column(String, index=True)
    competitor_data = Column(Text)  # JSON string of competitor analysis
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class ContentDraft(Base):
    """Table to store generated content drafts."""
    __tablename__ = 'content_drafts'
    
    id = Column(Integer, primary_key=True)
    keyword = Column(String, index=True)
    title = Column(String)
    content_markdown = Column(Text)
    meta_data = Column(Text) # JSON string of extra metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class DBClient:
    """Service for database interactions."""
    
    def __init__(self):
        self.engine = create_engine(Config.DATABASE_URL, connect_args={"check_same_thread": False})
        Base.metadata.create_all(self.engine)
        self.SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=self.engine)

    def get_session(self):
        """Get a new database session."""
        return self.SessionLocal()

    def save_research(self, keyword: str, data: str):
        session = self.get_session()
        try:
            record = ResearchRecord(keyword=keyword, competitor_data=data)
            session.add(record)
            session.commit()
        finally:
            session.close()

    def save_draft(self, keyword: str, title: str, content: str, meta: str):
        session = self.get_session()
        try:
            draft = ContentDraft(keyword=keyword, title=title, content_markdown=content, meta_data=meta)
            session.add(draft)
            session.commit()
        finally:
            session.close()

# Singleton instance
db_client = DBClient()
