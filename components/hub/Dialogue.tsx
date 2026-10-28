'use client';

// Aya's conversation box at the Desk. Lines type out (instantly with reduced motion); clicking the
// text or "Continue" finishes the line or moves on, and the last line of a topic offers choices.
// Screen readers get each complete line once, through a polite live region.

import { useEffect, useReducer, useRef } from 'react';
import type { DialogueAction, DialogueChoice, DialogueNode } from '@/content/about';
import { cue } from '@/lib/sound';

type State = { nodeId: string; line: number; chars: number };
type Action = { type: 'tick'; by: number } | { type: 'skip' } | { type: 'next' } | { type: 'goto'; nodeId: string };

function reducer(nodes: DialogueNode[]) {
  return (s: State, a: Action): State => {
    const text = nodes.find((n) => n.id === s.nodeId)!.lines[s.line];
    switch (a.type) {
      case 'tick':
        return s.chars >= text.length ? s : { ...s, chars: Math.min(text.length, s.chars + a.by) };
      case 'skip':
        return { ...s, chars: text.length };
      case 'next':
        return { ...s, line: s.line + 1, chars: 0 };
      case 'goto':
        return { nodeId: a.nodeId, line: 0, chars: 0 };
    }
  };
}

export function Dialogue({
  nodes,
  reduced,
  onAction,
  onTalking,
}: {
  nodes: DialogueNode[];
  reduced: boolean;
  onAction: (action: DialogueAction) => void;
  onTalking: (talking: boolean) => void;
}) {
  const [state, dispatch] = useReducer(reducer(nodes), { nodeId: nodes[0].id, line: 0, chars: 0 });
  const node = nodes.find((n) => n.id === state.nodeId)!;
  const text = node.lines[state.line];
  const typing = state.chars < text.length;
  const lastLine = state.line === node.lines.length - 1;
  const showChoices = !typing && lastLine && !!node.choices;
  const continueRef = useRef<HTMLButtonElement>(null);
  const choicesRef = useRef<HTMLDivElement>(null);

  // Typewriter: ~35 characters a second, or the whole line at once with reduced motion.
  useEffect(() => {
    if (!typing) return;
    let n = 0;
    const id = setInterval(() => {
      dispatch({ type: 'tick', by: reduced ? Infinity : 1 });
      if (n++ % 3 === 0) cue('blip'); // her voice: a soft murmur while the line types out
    }, 28);
    return () => clearInterval(id);
  }, [typing, reduced, text]);

  useEffect(() => {
    onTalking(typing);
  }, [typing, onTalking]);
  useEffect(() => () => onTalking(false), [onTalking]);

  // Keep keyboard focus on whatever moves the conversation on.
  useEffect(() => {
    if (showChoices) choicesRef.current?.querySelector('button')?.focus();
    else continueRef.current?.focus();
  }, [showChoices, state.nodeId, state.line]);

  const advance = () => {
    if (typing) dispatch({ type: 'skip' });
    else if (!lastLine) dispatch({ type: 'next' });
  };

  const choose = (c: DialogueChoice) => {
    if (c.next) dispatch({ type: 'goto', nodeId: c.next });
    if (c.action) onAction(c.action);
  };

  return (
    <section
      aria-label="Conversation with Aya"
      className="absolute inset-x-0 bottom-0 p-3 sm:inset-x-auto sm:bottom-6 sm:left-1/2 sm:w-[min(44rem,calc(100%-3rem))] sm:-translate-x-1/2 sm:p-0"
    >
      <div className="relative rounded-lg border-[1.5px] border-dashed border-thread/40 bg-cream/95 p-5 pt-7 shadow-xl backdrop-blur sm:p-7 sm:pt-8">
        <p className="label absolute -top-3.5 left-5 rounded-full bg-forest px-3 py-1.5 text-cream">
          Aya · <span lang="ar">آية</span>
        </p>
        <button type="button" onClick={() => onAction('close')} className="label stitch-link absolute top-3 right-4 text-ink-soft">
          Close
        </button>

        <p aria-hidden onClick={advance} className="min-h-[3.4em] text-lg leading-relaxed sm:text-xl" data-cursor={typing ? 'Skip' : undefined}>
          {text.slice(0, state.chars)}
          {typing && <span className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] animate-pulse bg-thread" />}
        </p>
        <p className="sr-only" aria-live="polite">
          {typing ? '' : text}
        </p>

        {showChoices ? (
          <div ref={choicesRef} className="mt-4 grid gap-2 sm:grid-cols-2">
            {node.choices!.map((c) => (
              <button
                key={c.label}
                type="button"
                onClick={() => choose(c)}
                className="rounded-full border-[1.5px] border-dashed border-forest/40 px-4 py-2.5 text-left text-sm transition-colors hover:border-forest hover:bg-forest hover:text-cream focus-visible:bg-forest focus-visible:text-cream"
              >
                {c.label}
              </button>
            ))}
          </div>
        ) : (
          <div className="mt-3 flex justify-end">
            <button ref={continueRef} type="button" onClick={advance} className="label rounded-full bg-forest px-4 py-2 text-cream transition-colors hover:bg-burgundy">
              {typing ? 'Skip' : 'Continue'} <span aria-hidden>▸</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
