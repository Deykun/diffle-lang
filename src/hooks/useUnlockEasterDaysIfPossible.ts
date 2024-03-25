import { useEffect } from 'react';

import { useSelector, useDispatch } from '@store';
import { resetEasterDays } from '@store/gameSlice';

export default function useUnlockEasterDaysIfPossible() {
  const dispatch = useDispatch();
  const gameLanguage = useSelector(state => state.game.language);

  useEffect(() => {
    if (!gameLanguage) {
      return;
    }

    dispatch(resetEasterDays());
  }, [dispatch, gameLanguage]);
}
