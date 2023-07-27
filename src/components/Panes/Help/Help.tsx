import Word from '@components/Words/Word'

import { HELP_WORDS } from './constants';

import './Help.scss'

const Help = ({ onPaneChange }) => {
    return (
        <div className="help">
            <h2 className="title">Jak gra się w diffle?</h2>
            <p>Cel to odgadniecie hasła używając jak najmniejszej liczby słów i liter.</p>
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
            <button onClick={() => onPaneChange('game')}>Zacznij grać</button>
        </div>
    )
};

export default Help;
