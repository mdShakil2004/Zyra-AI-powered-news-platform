
#models/chat.py


from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from core.database import Base
from datetime import datetime

class ChatMessage(Base):
    __tablename__ = "chat_history"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    role = Column(String)  # user or ai
    content = Column(Text)
    timestamp = Column(DateTime, default=datetime.utcnow)

    user = relationship("User")