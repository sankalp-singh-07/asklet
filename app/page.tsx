import Image from 'next/image';

export default function Home() {
	console.log(process.env.MONGO_URI);
	return <h1>Main Branch</h1>;
}
