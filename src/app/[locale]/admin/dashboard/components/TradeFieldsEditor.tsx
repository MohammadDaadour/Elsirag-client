'use client';

import { ProductSpec, ProductPriceOption } from '@/types/product';

interface TradeFieldsEditorProps {
    packSize: string;
    setPackSize: (value: string) => void;
    specs: ProductSpec[];
    setSpecs: (value: ProductSpec[]) => void;
    priceOptions: ProductPriceOption[];
    setPriceOptions: (value: ProductPriceOption[]) => void;
    disabled?: boolean;
}

const inputClass =
    'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-stone-800 disabled:opacity-50';

/**
 * The detail a wholesale buyer asks for: how many come in a carton, the
 * physical specs, and the price for each sheet count.
 */
export default function TradeFieldsEditor({
    packSize,
    setPackSize,
    specs,
    setSpecs,
    priceOptions,
    setPriceOptions,
    disabled = false,
}: TradeFieldsEditorProps) {
    const updateSpec = (index: number, patch: Partial<ProductSpec>) => {
        setSpecs(specs.map((row, i) => (i === index ? { ...row, ...patch } : row)));
    };

    const updateOption = (index: number, patch: Partial<ProductPriceOption>) => {
        setPriceOptions(priceOptions.map((row, i) => (i === index ? { ...row, ...patch } : row)));
    };

    return (
        <div className="flex flex-col gap-6 border-t pt-5 mt-1">
            <div>
                <label className="block mb-1 text-sm font-medium">Units per carton</label>
                <input
                    type="number"
                    min={0}
                    className={inputClass}
                    placeholder="e.g. 24"
                    value={packSize}
                    onChange={(e) => setPackSize(e.target.value)}
                    disabled={disabled}
                />
                <p className="mt-1 text-xs text-gray-500">Leave blank if it does not apply.</p>
            </div>

            <div>
                <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium">Specifications</label>
                    <button
                        type="button"
                        onClick={() => setSpecs([...specs, { label: '', value: '' }])}
                        disabled={disabled}
                        className="text-sm text-rose-600 hover:text-rose-700 cursor-pointer disabled:opacity-50"
                    >
                        + Add row
                    </button>
                </div>

                {specs.length === 0 ? (
                    <p className="text-xs text-gray-500">
                        No specs yet — add rows like “Size / A5” or “Paper / 70gsm”.
                    </p>
                ) : (
                    <div className="flex flex-col gap-2">
                        {specs.map((row, index) => (
                            <div key={index} className="flex gap-2 items-center">
                                <input
                                    type="text"
                                    className={inputClass}
                                    placeholder="Size"
                                    value={row.label}
                                    onChange={(e) => updateSpec(index, { label: e.target.value })}
                                    disabled={disabled}
                                />
                                <input
                                    type="text"
                                    className={inputClass}
                                    placeholder="A5"
                                    value={row.value}
                                    onChange={(e) => updateSpec(index, { value: e.target.value })}
                                    disabled={disabled}
                                />
                                <button
                                    type="button"
                                    onClick={() => setSpecs(specs.filter((_, i) => i !== index))}
                                    disabled={disabled}
                                    className="px-3 py-2 text-sm text-red-500 hover:text-red-700 cursor-pointer disabled:opacity-50"
                                    aria-label="Remove spec"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div>
                <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium">Sheet counts and prices</label>
                    <button
                        type="button"
                        onClick={() => setPriceOptions([...priceOptions, { label: '', price: '' }])}
                        disabled={disabled}
                        className="text-sm text-rose-600 hover:text-rose-700 cursor-pointer disabled:opacity-50"
                    >
                        + Add row
                    </button>
                </div>

                {priceOptions.length === 0 ? (
                    <p className="text-xs text-gray-500">
                        No options yet — the product page will show the single price above.
                    </p>
                ) : (
                    <div className="flex flex-col gap-2">
                        {priceOptions.map((row, index) => (
                            <div key={index} className="flex gap-2 items-center">
                                <input
                                    type="text"
                                    className={inputClass}
                                    placeholder="60 sheets"
                                    value={row.label}
                                    onChange={(e) => updateOption(index, { label: e.target.value })}
                                    disabled={disabled}
                                />
                                <input
                                    type="number"
                                    min={0}
                                    step="0.01"
                                    className={inputClass}
                                    placeholder="45.00"
                                    value={row.price}
                                    onChange={(e) => updateOption(index, { price: e.target.value })}
                                    disabled={disabled}
                                />
                                <button
                                    type="button"
                                    onClick={() => setPriceOptions(priceOptions.filter((_, i) => i !== index))}
                                    disabled={disabled}
                                    className="px-3 py-2 text-sm text-red-500 hover:text-red-700 cursor-pointer disabled:opacity-50"
                                    aria-label="Remove option"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                        <p className="text-xs text-gray-500">Wholesale price per unit, in EGP.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
