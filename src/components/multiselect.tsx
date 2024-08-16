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
    placeholder: string;
    toggle?: boolean;
    toggleLabel?: string;
    toggleValue?: boolean;
}

export default function Multiselect({options, label, defaultValue, placeholder, toggle, toggleLabel, toggleValue}: SelectProps ) {
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [toggleChecked, setToggleChecked] = useState(toggleValue);
    const count = useRef(null);

    const toggleOption = (option) => {
        if (toggle && !toggleChecked) {
          return;
        }

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

      const handleClickOutsideSelectField = (e) => {
        if (toggle && !toggleChecked) {
          return;
        }

        if (e.target.getAttribute('id') === 'select-field' && document.getElementById("select-list").classList.contains('hidden')) {
          return document.getElementById("select-list").classList.toggle('hidden');
        }
        
        if (e.target.getAttribute('id') === 'select-field' && !document.getElementById("select-list").classList.contains('hidden')) {
          return document.getElementById("select-list").classList.toggle('hidden');
        }

        if (e.target.getAttribute('id') !== 'select-value' && !document.getElementById("select-list").classList.contains('hidden')) {
          return document.getElementById("select-list").classList.toggle('hidden')
        }
      }

      const handleToggleChange = () => {
        setToggleChecked(!toggleChecked);
        setSelectedOptions([]);
      }
    
      useEffect(() => {
        document.body.addEventListener("click", handleClickOutsideSelectField)

        if (count.current == null && defaultValue) {
          preSelectValues();
        }
        return () => { 
          count.current = 1; 
          document.body.removeEventListener("click", handleClickOutsideSelectField)
        }
      }, [toggleChecked]);
          
    return (
        <>
            <div className="flex justify-between">
              <label htmlFor="multiselect" className="block mb-2 text-sm font-medium text-white">{label}</label>
              {toggle && <label className="label pt-0 cursor-pointer">
                <span className="label-text mr-2">{toggleLabel}</span>
                <input type="checkbox" className="toggle" defaultChecked={toggleValue} onChange={handleToggleChange}/>
              </label>}
            </div>
            <input type="text" defaultValue={selectedOptions.length ? selectedOptions.map(o => o.value).join(',') : null} name="multiselect" id="multiselect" hidden />
            <div id="select-field" className={`cursor-pointer border sm:text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 ${selectedOptions.length ? 'text-white' : 'text-gray-400'}`}>{selectedOptions.length ? selectedOptions.map(o => o.label).join(', ') : placeholder}</div>
            <ul id="select-list" className="hidden absolute max-w-sm border text-sm rounded-lg w-full p-2.5 bg-gray-800 border-gray-600">
            {options.map((option) => (
              <li
                id="select-value"
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