import { env } from 'process';
import { coalesceResponse, createBearerAuthorizationInstance } from './lib/axios';
import { debug } from './lib/debug';

export default async function action() {
  const ollamaAPI = await createBearerAuthorizationInstance(env.OLLAMA_HOST, env.OLLAMA_TOKEN);

  return ollamaAPI
    .post('/v1/chat/completions', {
      model: 'deepseek-coder:1.3b',
      temperature: 0.7,
      messages: [{ role: 'user', content: 'Make a node.js "hello world" app using no frameworks' }]
    })
    .then(coalesceResponse)
    .then(debug('chat response'));
}

action();
