from langchain_core.prompts import PromptTemplate
from langchain_openai import ChatOpenAI
from langchain_core.output_parsers import JsonOutputParser
from pydantic import BaseModel, Field
from typing import List, Dict
from src.config import Config


class MentalHealthRubric(BaseModel):
    scores: Dict[str, int] = Field(
        ..., 
        description="Score per mental health category: Mood Stability, Cognitive Clarity, Stress & Anxiety Levels, Social Engagement, Self-Esteem & Motivation (0–10 each)"
    )
    explanations: Dict[str, str] = Field(
        ..., 
        description="Explanations for each score"
    )
    average_score: float = Field(..., ge=0, le=10, description="Average score across all categories (0–10)")
    summary: str = Field(..., description="A brief summary of the overall mental health state")


class MentalHealthRubricScorer:
    def __init__(self, api_key: str = Config.OPENAI_API_KEY, model_name: str = "gpt-3.5-turbo", temperature: float = 0.5):
        self.model = ChatOpenAI(api_key=api_key, model_name=model_name, temperature=temperature)
        self.parser = JsonOutputParser(pydantic_object=MentalHealthRubric)

        self.prompt_template = PromptTemplate(
            template=(
                "Analyze the following mental health conversation between a doctor and patient:\n\n"
                "{chat_history}\n\n"
                "Based on the conversation, rate the patient's mental health using the following rubric:\n"
                "1. Mood Stability (0–10)\n"
                "2. Cognitive Clarity (0–10)\n"
                "3. Stress & Anxiety Levels (0–10)\n"
                "4. Social Engagement (0–10)\n"
                "5. Self-Esteem & Motivation (0–10)\n\n"
                "Provide:\n"
                "- A score (0–10) for each of the five categories\n"
                "- A short explanation for each score\n"
                "- The overall average score\n"
                "- A final summary of the patient's mental state\n\n"
                "Format your answer as JSON following this structure:\n"
                "{format_instructions}"
            ),
            input_variables=["chat_history"],
            partial_variables={"format_instructions": self.parser.get_format_instructions()}
        )

        self.chain = self.prompt_template | self.model | self.parser

    def format_chat_history(self, conversation: List[Dict[str, str]]) -> str:
        return "\n".join(f"{msg['role'].title()}: {msg['content']}" for msg in conversation)

    def score_conversation(self, conversation: List[Dict[str, str]]) -> dict:
        chat_str = self.format_chat_history(conversation)
        return self.chain.invoke({'chat_history': chat_str})
