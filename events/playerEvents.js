function isAbortError(error) {
	return (
		error?.name === 'AbortError' ||
		error?.code === 'ABORT_ERR' ||
		error?.cause?.name === 'AbortError'
	);
}

function notifyChannel(queue, message) {
	const channel = queue?.metadata;
	if (!channel?.send) return;

	channel.send(message).catch((err) => {
		console.error('[Player] Falha ao enviar mensagem no canal:', err.message);
	});
}

function handlePlayerError(queue, error, context) {
	if (isAbortError(error)) {
		console.warn(`[${context}] Conexão abortada: ${error.message}`);
		return;
	}

	console.error(`[${context}]`, error);

	if (queue) {
		notifyChannel(queue, `Erro ao reproduzir: ${error.message}`);
	}
}

module.exports = {
	setUpPlayerEvents(player) {
		player.events.on('error', (queue, error) => {
			handlePlayerError(queue, error, 'Queue Error');
		});

		player.events.on('playerError', (queue, error, track) => {
			const trackInfo = track ? ` (${track.title})` : '';
			handlePlayerError(queue, error, `Player Error${trackInfo}`);
		});

		player.events.on('debug', (queue, message) => {
			console.debug(`[Player Debug] ${message}`);
		});

		player.events.on('disconnect', (queue) => {
			console.log('[Player] Desconectado do canal de voz.');
			notifyChannel(queue, 'Desconectei do canal de voz.');
		});

		player.events.on('playerStart', (queue, track) => {
			notifyChannel(queue, `Tocando agora: **${track.title}**`);
		});

		player.events.on('audioTrackAdd', (queue, track) => {
			notifyChannel(queue, `**${track.title}** adicionada à fila.`);
		});
	},
};
