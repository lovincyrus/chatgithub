<h1 align="center">ChatGitHub</h1>

<p align="center">
  Chat with GitHub using natural language built with OpenAI Functions and Vercel AI SDK.
</p>

https://github.com/lovincyrus/chatgithub/assets/1021101/1af44fff-79d7-4fff-8fad-efa0354062f4

<br/>

## Model Providers

This template ships with OpenAI `gpt-4-1106-preview` as the default. However, thanks to the [Vercel AI SDK](https://sdk.vercel.ai/docs), you can switch LLM providers to [Anthropic](https://anthropic.com), [Hugging Face](https://huggingface.co), or using [LangChain](https://js.langchain.com) with just a few lines of code.

## Getting Started

```bash
echo "OPENAI_API_KEY=XXXXXX" > .env.local
pnpm install
pnpm dev
```

Your app template should now be running on [localhost:3000](http://localhost:3000/).

## Acknowledgements

Hacked from scratch using [ai-chatbot](https://github.com/vercel-labs/ai-chatbot) and inspired by [chathn](https://github.com/steven-tey/chathn)
