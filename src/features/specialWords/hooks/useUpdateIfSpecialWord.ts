import { useEffect } from 'react';

import { useDispatch, useSelector } from '@store';
import { setToast } from '@store/appSlice';
import {
  toggleSpecialWordIfApplied,
} from '@features/specialWords/actions';

function useUpdateIfSpecialWord() {
  const dispatch = useDispatch();

  const wordToSubmit = useSelector(state => state.game.wordToSubmit);

  useEffect(() => {
    const {
      wasApplied,
      isActive,
    } = toggleSpecialWordIfApplied(wordToSubmit);

    if (wasApplied) {
      dispatch(setToast({
        text: isActive ? 'feature.specialWord.wasActivated' : 'feature.specialWord.wasDeactivated',
      }));
    }
  }, [dispatch, wordToSubmit]);
}

export default useUpdateIfSpecialWord;
