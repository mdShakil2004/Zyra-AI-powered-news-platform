import asyncio
import sys
import asyncpg

if sys.platform.startswith("win"):
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

DB_HOSTADDR = "2406:da1a:6b0:f604:e3fa:d80e:3cdd:6e41"  # 👈 put the IPv4 you got from nslookup

async def test():
    conn = await asyncpg.connect(
        user="postgres",
        password="uYxLF$U3-2.e3GP",  # RAW password here (NOT encoded)
        database="postgres",
        hostaddr=DB_HOSTADDR,        # 🔥 bypass DNS
        port=5432,
        ssl=True,
    )
    print("CONNECTED OK")
    await conn.close()

asyncio.run(test())
