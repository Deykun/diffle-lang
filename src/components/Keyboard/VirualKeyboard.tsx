import clsx from 'clsx';
import {
  useRef, useCallback, useState, useEffect,
} from 'react';

import { AffixStatus } from '@common-types';
import { useDispatch, useSelector } from '@store';
import { submitAnswer, letterChangeInAnswer } from '@store/gameSlice';
import { selectIsGameEnded, selectKeyboardState, selectGameLanguageKeyboardInfo } from '@store/selectors';

import useWindowResize from '@hooks/useWindowResize';
import useVibrate from '@hooks/useVibrate';

import KeyCap from './KeyCap';
import VirualKeyboardConfirm from './VirualKeyboardConfirm';

import './VirualKeyboard.scss';

const VirualKeyboard = () => {
  const keyboardRef = useRef<HTMLElement | null>(null);
  const dispatch = useDispatch();
  const shouldConfirmEnter = useSelector((state) => state.app.shouldConfirmEnter);
  const isSmallKeyboard = useSelector((state) => state.app.isSmallKeyboard);
  const { keyLines, allowedKeys } = useSelector(selectGameLanguageKeyboardInfo);
  const isGameEnded = useSelector(selectIsGameEnded);
  const type = useSelector(selectKeyboardState);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const { vibrateKeyboard, vibrateKeyboardIncorrect } = useVibrate();

  const closeConfirm = () => setIsConfirmOpen(false);

  const handleSubmit = useCallback(() => {
    vibrateKeyboard();

    dispatch(submitAnswer());
    setIsConfirmOpen(false);
  }, [dispatch, vibrateKeyboard]);

  const toggleConfirmModal = useCallback(() => {
    vibrateKeyboard();

    setIsConfirmOpen((prevValue) => !prevValue);
  }, [vibrateKeyboard]);

  const handleType = useCallback((keyTyped: string, typed?: AffixStatus) => {
    const isAllowedKey = allowedKeys.includes(keyTyped);

    if (isAllowedKey) {
      if (typed && [AffixStatus.Incorrect, AffixStatus.IncorrectOccurance].includes(typed)) {
        vibrateKeyboardIncorrect();
      } else {
        vibrateKeyboard();
      }

      dispatch(letterChangeInAnswer(keyTyped));
    }
  }, [allowedKeys, dispatch, vibrateKeyboard, vibrateKeyboardIncorrect]);

  const [width] = useWindowResize();

  const setKeyboardHeightVar = useCallback(() => {
    if (keyboardRef.current) {
      const keyboardHeight = keyboardRef.current.offsetHeight;
      const root = document.querySelector<HTMLElement>(':root');

      if (root && keyboardHeight > 0) {
        root.style.setProperty('--keyboard-height', `${keyboardHeight}px`);
      }
    }
  }, []);

  useEffect(() => {
    setKeyboardHeightVar();
  }, [setKeyboardHeightVar, width]);

  const enterCallback = shouldConfirmEnter ? toggleConfirmModal : handleSubmit;

  const shouldShowConfirm = isConfirmOpen && !isGameEnded;

  if (keyLines.length === 0) {
    return null;
  }

  return (
      <aside ref={keyboardRef} className={clsx('keyboard', type, { isSmall: isSmallKeyboard })}>
          {shouldShowConfirm && <VirualKeyboardConfirm closeConfirm={closeConfirm} />}
          {keyLines.map((line) => {
            return (
                <div key={line[0]} className="line">
                    {line.map((keyText) => {
                      let onClick = (typed?: AffixStatus) => handleType(keyText, typed);

                      if (keyText === 'enter') {
                        onClick = () => enterCallback();
                      }

                      return (<KeyCap key={keyText} text={keyText} onClick={onClick} />);
                    })}
                </div>
            );
          })}
      </aside>
  );
};

export default VirualKeyboard;
