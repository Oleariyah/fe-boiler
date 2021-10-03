const speak = (msg) => {
	const sp = new SpeechSynthesisUtterance(msg);
	[sp.voice] = speechSynthesis.getVoices();
	speechSynthesis.speak(sp);
}

speak(`Welcome, how are you doing today?`)