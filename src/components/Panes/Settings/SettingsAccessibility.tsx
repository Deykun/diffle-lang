import { useState } from "react";
import { useTranslation } from "react-i18next";

import { LOCAL_STORAGE } from "@const";

import { useDispatch } from "@store";
import { track } from "@store/appSlice";

import IconContrast from "@components/Icons/IconContrast";
import IconMoon from "@components/Icons/IconMoon";
import IconSun from "@components/Icons/IconSun";

import ButtonTile from "@components/Button/ButtonTile";
import Modal from "@components/Modal/Modal";

import Word from "@components/Words/Word";

import { EXAMPLE_WORD } from "./constants";
import IconAnimation from "@components/Icons/IconAnimation";
import { useIsAnimationLimited } from "@hooks/useIsAnimationLimited";

const SettingsAccessibility = () => {
  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);
  const isAnimationLimited = useIsAnimationLimited();
  // By default the animation is active
  const [isWordAnimationBlocked, setIsWordAnimationBlocked] =
    useState(isAnimationLimited);

  const { t } = useTranslation();

  const handleToggleDarkLightMode = () => {
    const isLightThemeBeforeToggle =
      document.documentElement.classList.contains("light");

    localStorage.setItem(
      LOCAL_STORAGE.THEME,
      isLightThemeBeforeToggle ? "dark" : "light",
    );

    dispatch(
      track({
        name: `click_change_to_${isLightThemeBeforeToggle ? "dark" : "light"}_mode`,
      }),
    );

    document.documentElement.classList.toggle("light");
  };

  const handleToggleHighContrastMode = () => {
    const isHighContrastBeforeToggle =
      document.documentElement.classList.contains("contrast");

    localStorage.setItem(
      LOCAL_STORAGE.THEME_CONTRAST,
      isHighContrastBeforeToggle ? "false" : "true",
    );

    dispatch(
      track({
        name: `click_${isHighContrastBeforeToggle ? "turn_off_contrast" : "turn_on_contrast"}`,
      }),
    );

    document.documentElement.classList.toggle("contrast");
  };

  const handleToggleWordAnimation = () => {
    localStorage.setItem(
      LOCAL_STORAGE.WORD_ANIMATION_BLOCK,
      isWordAnimationBlocked ? "false" : "true",
    );

    dispatch(
      track({
        name: `click_${isWordAnimationBlocked ? "turn_on_word_animation" : "turn_off_word_animation"}`,
      }),
    );

    setIsWordAnimationBlocked((value) => !value);
  };

  return (
    <>
      <ButtonTile
        className="button-tile-active--contrast"
        onClick={() => setIsOpen((value) => !value)}
      >
        <IconContrast />
        <span>{t("settings.highContrastMode")}</span>
      </ButtonTile>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="settings">
          <h3>{t("settings.accessibility")}</h3>
          <br />
          <Word guess={EXAMPLE_WORD} />
          <br />
          <ul className="list-col-3">
            <li>
              <ButtonTile isActive onClick={handleToggleDarkLightMode}>
                <span className="only-dark">
                  <IconMoon />
                  <span>{t("settings.darkMode")}</span>
                </span>
                <span className="only-light">
                  <IconSun />
                  <span>{t("settings.lightMode")}</span>
                </span>
              </ButtonTile>
            </li>
            <li>
              <ButtonTile
                className="button-tile-active--contrast"
                onClick={handleToggleHighContrastMode}
              >
                <IconContrast />
                <span>{t("settings.highContrastMode")}</span>
              </ButtonTile>
            </li>
            <li>
              <ButtonTile
                isActive={!isWordAnimationBlocked}
                onClick={handleToggleWordAnimation}
              >
                <IconAnimation />
                <span>{t("settings.wordAnimation")}</span>
              </ButtonTile>
            </li>
          </ul>
        </div>
      </Modal>
    </>
  );
};

export default SettingsAccessibility;
