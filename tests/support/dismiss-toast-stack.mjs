import assert from "node:assert/strict";

// Read the current foreground DOM node on each iteration. Sonner's animated
// stack changes indices as notifications dismiss or expire.
export async function dismissToastStack(frame, poll) {
  for (;;) {
    // A dismissed foreground toast keeps its index until its exit animation
    // removes it. During that gap every remaining toast has data-front=false.
    // Wait for the next real foreground control or an actually empty stack.
    await poll(() => frame.evaluate(() => !document.querySelector('[data-sonner-toast]') || !!document.querySelector('[data-sonner-toast][data-front="true"][data-visible="true"]:not([data-removed="true"])')), "the remaining toast stack becomes actionable or empty");
    const handle = await frame.evaluateHandle(() => document.querySelector('[data-sonner-toast][data-front="true"][data-visible="true"]:not([data-removed="true"])'));
    const toast = handle.asElement();
    if (!toast) {
      await handle.dispose();
      if (await frame.locator('[data-sonner-toast]').count() === 0) return;
      continue;
    }
    const close = await toast.$('button[aria-label="Close toast"]');
    try {
      assert.ok(close, "The foreground toast exposes its real dismissal control");
      try { await close.click(); }
      catch (error) {
        // Natural expiry can win the race with a real click. Only accept that
        // race when this exact node has entered removal or already detached.
        if (!await toast.evaluate(element => !element.isConnected || element.dataset.removed === "true")) throw error;
      }
      await poll(() => toast.evaluate(element => !element.isConnected), "the clicked toast is actually removed from the DOM");
    } finally { await close?.dispose(); await toast.dispose(); }
  }
}
