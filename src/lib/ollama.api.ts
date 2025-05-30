import { env } from 'process';
import { coalesceResponse, createBearerAuthorizationInstance } from './axios';
import { debug } from './debug';

export default async function action() {
  const ollamaAPI = await createBearerAuthorizationInstance(env.OLLAMA_BASE_URL, env.OLLAMA_TOKEN);

  return ollamaAPI
    .post('/chat/completions', {
      model: 'deepseek-coder:1.3b',
      temperature: 0.7,
      messages: [{ role: 'user', content: 'Make a node.js "hello world" app using no frameworks' }]
    })
    .then(coalesceResponse)
    .then(debug('chat response'));
}

action();
