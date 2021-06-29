import {
  InteractionType,
  InteractionResponseType,
  InteractionResponseFlags,
  verifyKey,
} from 'discord-interactions'

export async function handleRequest(request: Request): Promise<Response> {
  const signature = request.headers.get('X-Signature-Ed25519')!
  const timestamp = request.headers.get('X-Signature-Timestamp')!
  const body = await request.clone().arrayBuffer()

  //prettier-ignore
  const isValid = verifyKey(body, signature, timestamp, 'your-public-key')

  if (!isValid) {
    return new Response('bad request', { status: 401 })
  }

  const interaction = await request.json()

  if (interaction.type === InteractionType.PING) {
    return respond({
      type: InteractionType.PING,
    })
  }

  return respond({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      flags: InteractionResponseFlags.EPHEMERAL,
      content: 'this is coming from slash commands owo',
    },
  })
}

const respond = (body: object) =>
  new Response(JSON.stringify(body), {
    headers: { 'Content-Type': 'application/json' },
    status: 200,
  })
