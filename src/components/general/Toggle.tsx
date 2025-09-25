const Toggle = (options: { disabled?: boolean, checked: boolean, onChange: (checked: boolean) => void }) => {
    const isDisabled = options.disabled || false
    
    return (
        <label className={`inline-flex items-center ${isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
            <input 
                type="checkbox" 
                value="" 
                className="sr-only peer" 
                checked={options.checked} 
                onChange={(e) => !isDisabled && options.onChange(e.target.checked)} 
                disabled={isDisabled} 
            />
            <div className={`relative w-11 h-6 rounded-full peer transition-all ${
                isDisabled 
                    ? options.checked 
                        ? 'bg-gray-400 dark:bg-gray-500' 
                        : 'bg-gray-300 dark:bg-gray-600'
                    : 'bg-gray-200 dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600'
            } after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 ${
                isDisabled 
                    ? options.checked 
                        ? 'after:translate-x-full rtl:after:-translate-x-full after:border-white' 
                        : ''
                    : 'peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white'
            }`} />
        </label>
    )
}

export default Toggle