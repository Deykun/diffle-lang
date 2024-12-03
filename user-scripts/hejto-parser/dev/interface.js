appendCSS(`
.hp-text-input-wrapper {
  display: flex;
  gap: 5px;
  position: relative;
}

.hp-text-input-wrapper input {
  width: 100%;
  padding-left: 10px;
}

.hp-text-input-wrapper label {
  position: absolute;
  top: 0;
  left: 5px;
  transform: translateY(-50%);
  background-color: var(--hp-nav-item-bg);
  padding: 2px 5px;
  border-radius: 2px;
  font-size: 9px;
}
`, { sourceName: 'interface-text-input' });

const getTextInput = ({
  idInput, idButton, label, name, value = '', placeholder, isDisabled = false,
}) => {
  return `<div class="hp-text-input-wrapper">
    <input
      ${idInput ? ` id="${idInput}" ` : ''}
      type="text"
      ${name ? ` name="${name}" ` : ''}
      value="${value}"
      placeholder="${placeholder}"
      ${isDisabled ? ' disabled ' : ''}
    />
    ${label ? `<label>${label}</label>` : ''}
    <button id="${idButton}" class="hp-nav-popup-button" title="Save">
      ${IconSave}
    </button>
  </div>`;
};

appendCSS(`
.hp-checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: 5px;
  font-weight: 400;
}

.hp-checkbox-wrapper input {
  margin-left: 5px;
  margin-right: 5px;
}
`, { sourceName: 'interface-value' });

const getCheckbox = ({
  idInput, classNameInput, label, name, value, isChecked = false, type = 'checkbox',
}) => {
  return `<label class="hp-checkbox-wrapper">
    <span>
      <input
        type="${type}"
        ${idInput ? ` id="${idInput}" ` : ''}
        ${classNameInput ? ` class="${classNameInput}" ` : ''}
        name="${name}"
        ${value ? `value="${value}"` : ''}
        ${isChecked ? ' checked' : ''}
      />
    </span>
    <span>${label}</span>
  </label>`;
};

const getRadiobox = (params) => {
  return getCheckbox({ ...params, type: 'radio' });
};
