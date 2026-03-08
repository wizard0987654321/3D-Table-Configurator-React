import { useState, useRef, useEffect } from 'react';

function CustomSelect({ value, onChange, options, disabled }) {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef(null);

    // find the label for the currently selected value
    const selectedOption = options.find(opt => String(opt.value) === String(value));
    const displayLabel = selectedOption ? selectedOption.label : '';

    // close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (opt) => {
        if (opt.disabled) return;
        onChange(opt.value);
        setIsOpen(false);
    };

    return (
        <div className={`custom-select ${disabled ? 'custom-select--disabled' : ''}`} ref={ref}>
            <div
                className={`custom-select__trigger ${isOpen ? 'custom-select__trigger--open' : ''}`}
                onClick={() => !disabled && setIsOpen(!isOpen)}
            >
                <span>{displayLabel}</span>
                <span className="custom-select__arrow">{isOpen ? '▲' : '▼'}</span>
            </div>
            {isOpen && (
                <ul className="custom-select__dropdown">
                    {options.map((opt) => (
                        <li
                            key={opt.value}
                            className={`custom-select__option 
                                ${String(opt.value) === String(value) ? 'custom-select__option--selected' : ''} 
                                ${opt.disabled ? 'custom-select__option--disabled' : ''}`}
                            onClick={() => handleSelect(opt)}
                        >
                            {opt.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default CustomSelect;
