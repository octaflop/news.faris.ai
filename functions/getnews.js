import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAI } from "langchain/llms/openai";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RetrievalQAChain } from "langchain/chains";
import snarkdown from 'snarkdown';

export default {
    async fetch(request, env, ctx) {
        const news_url = "http://news.google.com/?output=atom";
        const loader = new CheerioWebBaseLoader(news_url);
        const docs = await loader.loadAndSplit();
        console.log(docs);

        const store = await MemoryVectorStore.fromDocuments(docs, new OpenAIEmbeddings({ openAIApiKey: env.OPENAI_API_KEY}));

        const model = new OpenAI({
            openAIApiKey: env.OPENAI_API_KEY,
            modelName: "gpt-3.5-turbo-16k"
        });
        const chain = RetrievalQAChain.fromLLM(model, store.asRetriever());

        const { searchParams } = new URL(request.url);
        const prompt = "Summarize and group the articles into a bulleted list, sort in order of emotional impact. Provide markdown links with each listed point. Add historic context to each point.";
        const question = searchParams.get('question') ?? prompt;

        const res = await chain.call({
            query: question,
        });
        console.log(res.text);

	return res;
    },
};
