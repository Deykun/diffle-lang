import Word from '@components/Words/Word'
import Button from '@components/Button/Button';
import IconGamepad from '@components/Icons/IconGamepad';

import { HELP_WORDS } from './constants';

import './Help.scss'

interface Props {
    changePane: (pane: string) => void;
}

const Help = ({ changePane }: Props) => {
    return (
        <div className="help">
            <h2 className="title">Jak gra się w diffle?</h2>
            <p>Cel to odgadnięcie hasła używając jak najmniejszej liczby słów i liter.</p>
            <p>Po każdej próbie litery zostaną oznaczone odpowiednim kolorem.</p>
            <h2 className="title">Przykład</h2>
            <Word guess={HELP_WORDS[0]} />
            <p>Szarych liter nie ma w haśle.</p>
            <Word guess={HELP_WORDS[1]} />
            <p>Litery <strong>P</strong> i <strong>R</strong> są w haśle w tej kolejności, ale nie obok siebie.<br />Litera <strong>S</strong> jest w haśle ale nie za <strong>R</strong>.</p>
            <Word guess={HELP_WORDS[2]} />
            <p>Litery <strong>UPE</strong> są w haśle ciągiem.</p>
            <Word guess={HELP_WORDS[3]} />
            <p>Hasło zaczyna się na litrę <strong>S</strong>, zawiera literę <strong>P</strong> i kończy na <strong>R</strong>.</p>
            <Word guess={HELP_WORDS[4]} />
            <p>Podane słowo jest hasłem.</p>
            <p>
                <Button onClick={() => changePane('game')}>
                    <IconGamepad />
                    <span>GRAJ</span>
                </Button>
            </p>
            <footer>
                <h2 className="title">Źródła</h2>
                <p>
                    Specjalne podziękowania. dla SJP i FreeDict.
                </p>
                <ul>
                    <li><a href="https://sjp.pl" target="blank">https://sjp.pl</a> - używane jako spellchecker</li>
                    <li><a href="https://freedict.org/" target="blank">ttps://freedict.org/</a> - do ustalenia lepszych haseł (bez dziwnnych odmian)</li>
                    <li><a href="https://iconmonstr.com/" target="blank">https://iconmonstr.com/</a> - ikonki</li>
                    <li><a href="https://www.nytimes.com/games/wordle/index.html" target="blank">https://www.nytimes.com/games/wordle/</a> - oryginalne wordle</li>
                    <li><a href="https://hedalu244.github.io/diffle/" target="blank">https://hedalu244.github.io/diffle/</a> - oryginalne diffle</li>
                </ul>
            </footer>
        </div>
    )
};

export default Help;
