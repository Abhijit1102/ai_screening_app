from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
from langchain_core.output_parsers import StrOutputParser
from src.config import Config

class QAChatBot:
    """A chatbot that answers questions based on provided context."""

    def __init__(self):
        """Initialize the chatbot with model configuration."""
        self.model_name = "gpt-3.5-turbo"
        self.temperature = 0.5
        self.api_key = Config.OPENAI_API_KEY
        if not self.api_key:
            raise ValueError("OPENAI_API_KEY is missing. Please check your .env file.")
        
        self.model = ChatOpenAI(
            model_name=self.model_name,
            temperature=self.temperature,
            api_key=self.api_key,
        )
        self.parser = StrOutputParser()
        self.chat_history = []  


    def get_answer(self, question, context):
        """Generate an answer based on the dynamic context and question."""
        system_message = SystemMessage(
        content=f"You are a mental health screening doctor. Based on the provided patient information: '{context}', engage in a conversation to assess the patient's mental health. Generate queries tailored to the patient's age and context."
        )

        if not any(isinstance(msg, SystemMessage) for msg in self.chat_history):
            self.chat_history.insert(0, system_message)
 
        self.chat_history.append(HumanMessage(content=question))

        result = self.model.invoke(self.chat_history)

        self.chat_history.append(AIMessage(content=result.content))

        return result.content