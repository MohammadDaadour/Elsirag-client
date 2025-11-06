export default function HoverMenu({ title, children }: { title: string | React.ReactElement; children: React.ReactNode }) {
    return (
        <div className="group relative items-center">
            <button className="hover:text-black cursor-pointer p-6 px-3 ">{title}</button>
            <div className="invisible scale-y-0 opacity-0 scale-x-0 group-hover:visible group-hover:opacity-100 group-hover:scale-y-100 group-hover:scale-x-100 transition-all duration-200 origin-center">
                {children}
            </div>
        </div>
    );
}