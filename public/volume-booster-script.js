
// This script runs in the MAIN world to access media elements and AudioContext
(function () {
    const windowObj = window;
    if (windowObj._bisueVolumeBoosterLoaded) return;
    windowObj._bisueVolumeBoosterLoaded = true;

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    const audioContext = new AudioContextClass();
    const gainNode = audioContext.createGain();
    gainNode.connect(audioContext.destination);

    const sources = new WeakMap();

    function connectElement(element) {
        if (sources.has(element)) return;

        try {
            const source = audioContext.createMediaElementSource(element);
            source.connect(gainNode);
            sources.set(element, source);
            console.log('[Volume Booster] Connected to media element:', element);
        } catch (e) {
            // Often fails if element is already connected or not ready
            console.warn('[Volume Booster] Failed to connect element', e);
        }
    }

    // Observe logic to find new video/audio tags
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeName === 'VIDEO' || node.nodeName === 'AUDIO') {
                    connectElement(node);
                }
                if (node.querySelectorAll) {
                    node.querySelectorAll('video, audio').forEach((el) => {
                        connectElement(el);
                    });
                }
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Initial scan
    document.querySelectorAll('video, audio').forEach((el) => {
        connectElement(el);
    });

    // Listen for messages from Content Script
    window.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'BISUE_VOLUME_BOOST') {
            const level = event.data.level;
            if (typeof level === 'number') {
                gainNode.gain.value = level;
            }
        }
    });
})();
