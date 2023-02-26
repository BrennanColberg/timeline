export default function Menu() {
  return (
    <form id="menu" className="flex flex-col items-center py-4">
      <div className="mt-6 mb-10 flex flex-col gap-3">
        <h1 className="font-bold text-xl text-center">Welcome to Timeline!</h1>
        <p className="w-96">
          This is based on{" "}
          <a
            href="https://amzn.to/3YCbHPc"
            className="underline"
            target="_blank"
          >
            the card game of the same name.
          </a>
        </p>
        <p className="w-96">
          Your goal is to put historical events in their proper order. Each has
          a year, and you are to select the spot in the timeline where the event
          you are shown fits.
        </p>
        <p className="w-96">When you get a place wrong, you lose. Good luck!</p>
      </div>
      <div className="flex flex-col items-center mx-auto bg-gray-200 px-10 py-5 rounded-lg shadow-md">
        <h2 className="font-bold mb-2">Select Events:</h2>
        <div className="flex flex-col items-stretch gap-1">
          <label className="px-2 py-1 bg-purple-200 select-none cursor-pointer rounded-md hover:shadow-sm">
            <input type="checkbox" name="presidents" /> American Presidents
          </label>
          <label className="px-2 py-1 bg-red-200 select-none cursor-pointer rounded-md hover:shadow-sm">
            <input type="checkbox" name="elements" /> Element Discoveries
          </label>
        </div>

        <button className="w-36 h-10 text-xl bg-green-400 hover:bg-green-300 rounded-md hover:shadow-sm shadow-md mt-4 font-bold">
          Start Game
        </button>
      </div>
    </form>
  )
}
