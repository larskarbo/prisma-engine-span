import { PrismaClient } from "@prisma/client";
import { logAndResetSpans, startInstrumentation } from "./instrumentation";

startInstrumentation();

const prisma = new PrismaClient();
const prisma2 = new PrismaClient();

async function main() {
	console.log(
		"prisma.user.findFirst -> this will not emit 'prisma:engine:*' spans"
	);
	await prisma.user.findFirst();
	logAndResetSpans();

	console.log("\n\n");

	console.log("prisma2.post.findFirst");
	await prisma2.post.findFirst();
	logAndResetSpans();
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
