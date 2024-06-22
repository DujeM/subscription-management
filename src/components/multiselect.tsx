"use client"

import { useEffect, useRef, useState } from "react";

interface SelectOptions {
    value: string;
    label: string;
}

interface SelectProps {
    options: SelectOptions[];
    label: string;
    defaultValue: string;
}

export default function Multiselect({options, label, defaultValue}: SelectProps ) {
    const [selectedOptions, setSelectedOptions] = useState([]);
    const count = useRef(null);

    const toggleOption = (option) => {
        setSelectedOptions((prevSelected) =>
          prevSelected.find(s => s.value === option.value)
            ? prevSelected.filter((opt) => opt.value !== option.value)
            : [...prevSelected, option]
        );
      };

      const preSelectValues = () => {
        const splitValues = defaultValue.split(',');
        splitValues.forEach(v => {
          toggleOption(options.find(o => o.value === v));
        });      
      }

      useEffect(() => {
        if (count.current == null && defaultValue) {
          preSelectValues();
        }
        return () => { count.current = 1; }
      }, []);
          
    return (
        <>
            <label htmlFor="multiselect" className="block mb-2 text-sm font-medium text-white">{label}</label>
            <input type="text" defaultValue={selectedOptions.map(o => o.value).join(',')} name="multiselect" id="multiselect" hidden />
            <div onClick={(e) => e.target['nextElementSibling'].classList.toggle('hidden')} className={`cursor-pointer border sm:text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 ${selectedOptions.length ? 'text-white' : 'text-gray-400'}`}>{selectedOptions.length ? selectedOptions.map(o => o.label).join(', ') : 'Assign subscriptions'}</div>
            <ul className="hidden absolute max-w-sm border text-sm rounded-lg w-full p-2.5 bg-gray-800 border-gray-600">
            {options.map((option) => (
              <li
                key={option.value}
                className={`cursor-pointer p-2 mb-1 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  selectedOptions.includes(option) ? 'bg-gray-700 border-solid border-2 border-sky-500' : ''
                }`}
                onClick={() => toggleOption(option)}
              >
                {option.label}
                {selectedOptions.includes(option) && (
                  <i className="fas fa-check ml-2"></i>
                )}
              </li>
            ))}
            </ul>
        </>
    )
}