export const getCountries = async () => {
    const cached = localStorage.getItem("countries");

    if (cached) return JSON.parse(cached);

    const res = await fetch(
        "https://restcountries.com/v3.1/all?fields=name,flags,idd,capital"
    );
    const data = await res.json();

    const formatted = data.map((c) => {
        const phone =
            c.idd?.root && c.idd?.suffixes
                ? c.idd.root + c.idd.suffixes[0]
                : "";

        return {
            name: c.name.common,
            flag: c.flags?.png,
            phone,
            capital: c.capital?.[0] || "",
        };
    }).sort((a, b) => a.name.localeCompare(b.name));

    localStorage.setItem("countries", JSON.stringify(formatted));

    return formatted;
};