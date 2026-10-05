import React, { useMemo } from 'react';
import katex from 'katex';

/**
 * Cleanly renders LaTeX formulas using KaTeX.
 * Handles display mode (block) and inline mode.
 * Catches any syntax anomalies safely and falls back cleanly without breaking UI.
 */
export default function MathView({
  math,
  block = false,
  className = '',
  style = {}
}) {
  const html = useMemo(() => {
    if (!math && math !== 0) return '';
    try {
      const tex = String(math).trim();
      return katex.renderToString(tex, {
        throwOnError: false,
        displayMode: block,
        strict: false
      });
    } catch (err) {
      console.warn('KaTeX render error:', err);
      return `<span class="katex-error">${String(math)}</span>`;
    }
  }, [math, block]);

  if (!html) return null;

  return (
    <span
      className={`insightx-math ${block ? 'insightx-math-block' : 'insightx-math-inline'} ${className}`}
      style={{
        display: block ? 'block' : 'inline-block',
        overflowX: block ? 'auto' : 'visible',
        maxWidth: '100%',
        ...style
      }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

/**
 * Helper component that renders text containing inline LaTeX snippets
 * such as \( ... \) or raw \sum, \frac, \bar, \sigma, etc.
 */
export function MathText({ text, style = {}, className = '' }) {
  const rendered = useMemo(() => {
    if (!text && text !== 0) return '';
    const str = String(text);

    // If string has \( ... \), replace each with KaTeX
    if (str.includes('\\(') && str.includes('\\)')) {
      return str.replace(/\\\((.*?)\\\)/g, (match, expr) => {
        try {
          return katex.renderToString(expr.trim(), { throwOnError: false, displayMode: false });
        } catch {
          return match;
        }
      });
    }

    // If string has $ ... $, replace with KaTeX
    if (/\$[^$]+\$/.test(str)) {
      return str.replace(/\$([^$]+)\$/g, (match, expr) => {
        try {
          return katex.renderToString(expr.trim(), { throwOnError: false, displayMode: false });
        } catch {
          return match;
        }
      });
    }

    // If string starts with a LaTeX command like \bar, \sigma, \mu, render as whole math
    if (/^\\[a-zA-Z]/.test(str)) {
      try {
        return katex.renderToString(str, { throwOnError: false, displayMode: false });
      } catch {
        return str;
      }
    }

    return str;
  }, [text]);

  // If text was transformed to HTML containing katex, render via dangerouslySetInnerHTML
  if (rendered.includes('<span class="katex">')) {
    return (
      <span
        className={`insightx-math-text ${className}`}
        style={style}
        dangerouslySetInnerHTML={{ __html: rendered }}
      />
    );
  }

  return (
    <span className={className} style={style}>
      {text}
    </span>
  );
}
