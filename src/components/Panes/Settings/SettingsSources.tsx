import IconBook from '@components/Icons/IconBook';
import IconBookAlt from '@components/Icons/IconBookAlt';

import IconGamepad from '@components/Icons/IconGamepad';
import IconGamepadAlt from '@components/Icons/IconGamepadAlt';
import IconGithub from '@components/Icons/IconGithub';
import IconIconmonstr from '@components/Icons/IconIconmonstr';

import './Settings.scss'

const SettingsSources = () => {
    return (
        <>
            <h2>Źródła</h2>
            <p>
                Specjalne podziękowania. dla SJP i FreeDict.
            </p>
            <ul>
                <li><a href="https://sjp.pl" target="blank">
                    <IconBookAlt /><span>sjp.pl - używane jako spellchecker</span></a>
                </li>
                <li>
                    <a href="https://freedict.org/" target="blank">
                        <IconBook /><span>freedict.org - do ustalenia lepszych haseł</span>
                    </a>
                </li>
                <li>
                    <a href="https://iconmonstr.com/" target="blank">
                        <IconIconmonstr /><span>iconmonstr.com - ikonki</span>
                    </a>
                </li>
                <li>
                    <a href="https://www.nytimes.com/games/wordle/index.html" target="blank">
                        <IconGamepadAlt /><span>oryginalne wordle</span>
                    </a>
                </li>
                <li>
                    <a href="https://hedalu244.github.io/diffle/" target="blank">
                        <IconGamepad /><span>oryginalne diffle</span>
                    </a>
                </li>
                <li>
                    <a href="https://github.com/Deykun/diffle-lang" target="blank">
                        <IconGithub /><span>repozytorium strony</span>
                    </a>
                </li>
            </ul>
        </>
    )
};

export default SettingsSources;
