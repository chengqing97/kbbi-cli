const colors = {
  Red: "\u001b[31m",
  Green: "\u001b[32m",
  Yellow: "\u001b[33m",
  Blue: "\u001b[34m",
  Magenta: "\u001b[35m",
  Cyan: "\u001b[36m",
  Reset: "\u001b[0m",
};

while (true) {
  const input = prompt("~ ");
  if (!input) continue;
  const response = await fetch(`https://kbbi.web.id/${input}`);
  const html = await response.text();
  let data = html.match(/(?<=<div id="info"><\/div>).*?(?=\t*<\/div>)/g)?.[0];

  if (data === undefined) {
    console.log(colors.Red + "No result");
    continue;
  }
  // Replace html code
  data = data.replaceAll("&#183;", "");
  data = data.replaceAll("&#233;", "é");

  // Remove unwanted tag
  data = data.replaceAll(/<sup>.*?<\/sup>/g, "");

  // Add line breaks
  data = data.replaceAll("<br/>", "\n");
  data = data.replaceAll(/<b>\d?<\/b>/g, "\n$&"); // definition number
  data = data.replaceAll(RegExp(`(?<=[^-~])<em>[^-~]*?<\/em>(?=[^<>]\w)`, "g"), "$&\n"); // definition without number

  // Add color
  data = data.replaceAll(/<b>([^\d])*?<\/b>/g, `${colors.Cyan}$&${colors.Reset}`); //title
  data = data.replaceAll(RegExp(`(?<=[^-~])<em>[^-~]*?<\/em>`, "g"), `${colors.Yellow}($&)${colors.Reset}`); // n v adv
  data = data.replaceAll(/<b>([\w\s]*--[\w\s]*)?<\/b>/g, `${colors.Blue}$&${colors.Reset}`); //  -- word
  data = data.replaceAll(
    /(<em>([^<>]*(~| --)[^<>]*)?<\/em>)|(([-~]+)<em>([^<>]*)?<\/em>)/g,
    `${colors.Green}$&${colors.Reset}`
  ); //  example

  // Remove all HTML tag
  data = data.replaceAll(/<[\s\S]*?>/g, "");

  const titleList: string[] = [];

  data = data
    .split("\n\n")
    .filter((item) => {
      titleList.push(item.split(" ")[0]);
      return item.trim().split(" ")[0] === `${colors.Cyan}${input}${colors.Reset}`;
    })
    .join("\n\n");

  console.log(data);
  console.log(titleList.join(", "));
  console.log();
}
