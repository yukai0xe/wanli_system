"use client";
import addNewTeam from "@/action/addNewTeam";

const FormPage = () => {
    return (
        <form className="mx-auto max-w-2xl px-4 py-24" onSubmit={(event) => {
            event.preventDefault();
            const form = event.currentTarget as HTMLFormElement;
            addNewTeam(new FormData(form));
            form.reset();
        }}>
            <div className="space-y-12">
                <div className="border-b border-gray-900/10 pb-12">
                    <h2 className="text-base/7 font-semibold text-white-900">New Team</h2>
                    <p className="mt-1 text-sm/6 text-white-600">This information will be displayed publicly so be careful what you share.</p>
                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="sm:col-span-full">
                            <label htmlFor="username" className="block text-sm/6 font-medium text-white-900">Team Name</label>
                            <div className="mt-2">
                                <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                                    <input type="text" name="username" id="username" className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6" placeholder="輸入隊伍名稱" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
             <div className="mt-6 flex items-center justify-end gap-x-6">
                <button type="submit" className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Save</button>
            </div>
        </form>
    );
}

export default FormPage;