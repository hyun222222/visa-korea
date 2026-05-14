from langchain_openai import ChatOpenAI
from langchain_anthropic import ChatAnthropic
from langchain_core.language_models.chat_models import BaseChatModel
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from typing import Type, TypeVar, Optional
from pydantic import BaseModel

from ..core.config import Config

T = TypeVar("T", bound=BaseModel)

class LLMClient:
    """Service for interacting with LLMs (OpenAI/Anthropic)."""
    
    def __init__(self):
        self.provider = Config.LLM_PROVIDER
        self.model_name = Config.LLM_MODEL
        self.llm = self._initialize_llm()

    def _initialize_llm(self) -> BaseChatModel:
        """Initialize the specific LLM based on configuration."""
        if self.provider == "openai":
            return ChatOpenAI(
                model=self.model_name,
                api_key=Config.OPENAI_API_KEY,
                temperature=0.7
            )
        elif self.provider == "anthropic":
            return ChatAnthropic(
                model=self.model_name,
                api_key=Config.ANTHROPIC_API_KEY,
                temperature=0.7
            )
        else:
            raise ValueError(f"Unsupported LLM provider: {self.provider}")

    def generate_text(self, system_prompt: str, user_prompt: str) -> str:
        """Generate a simple text response."""
        prompt = ChatPromptTemplate.from_messages([
            ("system", system_prompt),
            ("user", user_prompt)
        ])
        chain = prompt | self.llm
        response = chain.invoke({})
        return response.content

    def generate_structured(self, system_prompt: str, user_prompt: str, pydantic_model: Type[T]) -> T:
        """Generate a structured response matching a Pydantic model."""
        parser = PydanticOutputParser(pydantic_object=pydantic_model)
        
        # Append format instructions to the system prompt
        format_instructions = parser.get_format_instructions()
        full_system_prompt = f"{system_prompt}\n\n{format_instructions}"
        
        prompt = ChatPromptTemplate.from_messages([
            ("system", full_system_prompt),
            ("user", user_prompt)
        ])
        
        chain = prompt | self.llm | parser
        return chain.invoke({})

# Singleton instance
llm_client = LLMClient()
