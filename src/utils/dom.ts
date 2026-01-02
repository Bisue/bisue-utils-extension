/**
 * Creates a Shadow DOM host and returns the shadow root.
 * This isolates the extension's styles from the page's styles.
 * 
 * @param id Unique ID for the host element
 * @returns An object containing the host element, shadow root, and a root container div inside the shadow DOM
 */
export function createShadowWrapper(id: string) {
    let host = document.getElementById(id);
    let shadowRoot: ShadowRoot;
    let container: HTMLElement;

    if (!host) {
        host = document.createElement('div');
        host.id = id;
        host.style.position = 'fixed';
        host.style.top = '0';
        host.style.left = '0';
        host.style.width = '100%';
        host.style.height = '0'; // Host itself shouldn't take space/block clicks generally, specific logic might be needed
        host.style.zIndex = '2147483647'; // Max z-index
        host.style.pointerEvents = 'none'; // Passthrough clicks by default

        document.body.appendChild(host);
        shadowRoot = host.attachShadow({ mode: 'open' });

        container = document.createElement('div');
        container.style.pointerEvents = 'auto'; // Re-enable clicks for content
        shadowRoot.appendChild(container);
    } else {
        shadowRoot = host.shadowRoot!;
        container = shadowRoot.querySelector('div')!;
    }

    return { host, shadowRoot, container };
}

/**
 * Cleanup the shadow wrapper
 */
export function removeShadowWrapper(id: string) {
    const host = document.getElementById(id);
    if (host) {
        host.remove();
    }
}
