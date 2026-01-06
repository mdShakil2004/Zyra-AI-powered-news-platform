
#services/summarizer.py

def simple_summarize(text: str, title: str) -> str:
    sentences = text.split(". ")
    if len(sentences) <= 3:
        return text
    return ". ".join(sentences[:3]) + "." 