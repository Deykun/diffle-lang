appendCSS(`
  [data-hp-badge],
  [data-hp-badge-sm] {
    position: relative;
  }

  [data-hp-badge]::after,
  [data-hp-badge-sm]::after {
    content: attr(data-hp-badge);
    position: absolute;
    top: 40px;
    right: 10px;
    background-color: #fff;
    font-size: 13px;
    padding: 0 3px;
    border-radius: 2px;
    color: #0c54a2 !important;
    transform-origin: top left;
    overflow: hidden;
    transition: all 0.15s ease-in-out;
  }

  [data-hp-badge-sm]::after {
    max-width: 14px;
    content: attr(data-hp-badge-sm);
    font-size: 10px;
    padding: 0 2px;
  }

  [data-hp-badge]:hover::after,
  [data-hp-badge-sm]:hover::after,
  [data-hp-badge-open]::after {
    max-width: 300px;
  }
`, { sourceName: 'parse-page' });
