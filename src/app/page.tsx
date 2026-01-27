import Image from "next/image";

export default function Home() {
  return (
    <div className="w-full h-screen p-0 m-0 flex items-center justify-center">
      <div className="w-1/2  ">
        <form action="" className="flex flex-col w-1/2 mx-auto gap-8">
          <h1 className="text-3xl font-bold mb-4">Login</h1>
          <div className="">
            <input
              type="text"
              placeholder="Username"
              className="border-b border-b-border outline-0 p-2 w-full"
            />
            <input
              type="password"
              placeholder="Password"
              className="border-b border-b-border outline-0 p-2 w-full"
            />
          </div>
          <button
            type="submit"
            className="bg-primary text-white p-2 rounded mt-4"
          >
            Submit
          </button>
        </form>
      </div>
      <div className="w-1/2 bg-primary h-full flex flex-col justify-between items-center text-center text-white ">
        <h1 className="text-7xl font-bold mt-7 ">
          Welcome to
          <br />
          VU<span className="text-danger">.</span>
          <span className="font-medium"> Portal</span>
        </h1>
        <Image
          src="/login.png"
          alt="Logo"
          width={537.33}
          height={328}
          className="object-contain"
        />
      </div>
    </div>
  );
}
