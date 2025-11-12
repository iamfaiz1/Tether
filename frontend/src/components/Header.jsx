export default function Header() {
    return (
        <header className="absolute top-0 left-0 w-full z-10 py-6 px-4 md:px-8 bg-gradient-to-r from-indigo-600 to-cyan-600">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">Tether</h1>
                <a
                    href="#report-form"
                    className="bg-white text-slate-900 font-medium py-2 px-5 rounded-full hover:bg-slate-200 transition-colors"
                >
                    Report Child
                </a>
            </div>
        </header>
    );
}