import * as vscode from "vscode";
import { getData } from "./platforms";

export function activate(context: vscode.ExtensionContext) {

    const welcome = vscode.commands.registerCommand(
        "mockme.welcome",
        async () => {
            const panel = vscode.window.createWebviewPanel(
                "mockmeWelcome",
                "Welcome to MockMe",
                vscode.ViewColumn.Active,
                { enableScripts: true }
            );

            panel.webview.html = `
                <!DOCTYPE html>
				<html lang="en">
				<head>
					<meta charset="UTF-8">
					<title>Welcome to MockMe</title>
					<style>
						body { 
							font-family: sans-serif; 
							display: flex; 
							flex-direction: column; 
							align-items: center; 
							justify-content: center; 
							height: 100vh; 
							margin: 0;
						}
						.button { 
							margin-top: 20px; 
							padding: 10px 20px; 
							font-size: 16px; 
						}
						#landing-text { 
							font-size: 18px; 
							max-width: 600px; 
						}
						#details { 
							display: none; 
							flex-direction: column; 
							align-items: center; 
							padding: 30px;
							border-radius: 8px;
							box-shadow: 0 2px 10px rgba(0,0,0,0.1);
							min-width: 400px;
						}
						.form-group {
							width: 100%;
							margin-bottom: 20px;
						}
						.form-group label {
							display: block;
							margin-bottom: 5px;
							font-weight: 500;
						}
						.form-group input, .form-group select {
							width: 100%;
							padding: 12px;
							border: 1px solid #ddd;
							border-radius: 4px;
							font-size: 14px;
							box-sizing: border-box;
						}
						.form-group input:focus, .form-group select:focus {
							outline: none;
							box-shadow: 0 0 0 2px rgba(0, 122, 204, 0.2);
						}
						.form-row {
							display: flex;
							gap: 15px;
						}
						.form-row .form-group {
							flex: 1;
						}
						#error { 
							color: red; 
							margin-top: 10px; 
							text-align: center;
						}
						h1 {
							margin-bottom: 10px;
						}
						h3 {
							margin-bottom: 25px;
							text-align: center;
						}
						.optional {
							color: #666;
							font-size: 12px;
							font-weight: normal;
						}
					</style>
				</head>
				<body>
					<div id="landing">
						<h1>Welcome to MockMe!</h1>
						<p id="landing-text">This extension helps you track your programming journey by creating focused environments to simulate time based situations like programming interviews and coding challenges.</p>
						<button class="button" id="getStartedBtn">Get Started</button>
					</div>
					<div id="details">
						<h3>Set Up Your Profile</h3>
						<form id="profileForm">
							<div class="form-row">
								<div class="form-group">
									<label for="firstName">First Name</label>
									<input type="text" id="firstName" placeholder="Enter your first name" required />
								</div>
								<div class="form-group">
									<label for="lastName">Last Name</label>
									<input type="text" id="lastName" placeholder="Enter your last name" required />
								</div>
							</div>
							
							<div class="form-group">
								<label for="email">Email Address</label>
								<input type="email" id="email" placeholder="Enter your email address" required />
							</div>
							
							<div class="form-group">
								<label for="leetcodeId">LeetCode Username <span class="optional">(optional)</span></label>
								<input type="text" id="leetcodeId" placeholder="Enter your LeetCode username" />
							</div>
							
							<div class="form-row">
								<div class="form-group">
									<label for="preferredLanguage">Preferred Language</label>
									<select id="preferredLanguage" required>
										<option value="">Select a language</option>
										<option value="javascript">JavaScript</option>
										<option value="python">Python</option>
										<option value="java">Java</option>
										<option value="cpp">C++</option>
										<option value="c">C</option>
										<option value="csharp">C#</option>
										<option value="go">Go</option>
										<option value="rust">Rust</option>
										<option value="typescript">TypeScript</option>
										<option value="php">PHP</option>
										<option value="swift">Swift</option>
										<option value="kotlin">Kotlin</option>
									</select>
								</div>
								<div class="form-group">
									<label for="experienceLevel">Experience Level</label>
									<select id="experienceLevel" required>
										<option value="">Select level</option>
										<option value="beginner">Beginner</option>
										<option value="intermediate">Intermediate</option>
										<option value="advanced">Advanced</option>
										<option value="expert">Expert</option>
									</select>
								</div>
							</div>
							
							<div class="form-group">
								<label for="githubUsername">GitHub Username <span class="optional">(optional)</span></label>
								<input type="text" id="githubUsername" placeholder="Enter your GitHub username" />
							</div>
							
							<button type="submit" class="button" id="submitBtn">Continue</button>
						</form>
						<div id="error"></div>
					</div>
					<script>
						const vscode = acquireVsCodeApi();
						
						document.getElementById('getStartedBtn').onclick = () => {
							document.getElementById('landing').style.display = 'none';
							document.getElementById('details').style.display = 'flex';
						};
						
						document.getElementById('profileForm').onsubmit = (e) => {
							e.preventDefault();
							
							const firstName = document.getElementById('firstName').value.trim();
							const lastName = document.getElementById('lastName').value.trim();
							const email = document.getElementById('email').value.trim();
							const leetcodeId = document.getElementById('leetcodeId').value.trim();
							const preferredLanguage = document.getElementById('preferredLanguage').value;
							const experienceLevel = document.getElementById('experienceLevel').value;
							const githubUsername = document.getElementById('githubUsername').value.trim();
							
							document.getElementById('error').textContent = '';
							
							if (!firstName) {
								document.getElementById('error').textContent = "Please enter your first name.";
								return;
							}
							if (!lastName) {
								document.getElementById('error').textContent = "Please enter your last name.";
								return;
							}
							if (!email) {
								document.getElementById('error').textContent = "Please enter your email address.";
								return;
							}
							if (!preferredLanguage) {
								document.getElementById('error').textContent = "Please select your preferred programming language.";
								return;
							}
							if (!experienceLevel) {
								document.getElementById('error').textContent = "Please select your experience level.";
								return;
							}
							
							if (!email) {
								document.getElementById('error').textContent = "Please enter a valid email address.";
								return;
							}

							vscode.postMessage({
								command: 'submitProfile',
								data: {
									firstName,
									lastName,
									email,
									leetcodeId,
									preferredLanguage,
									experienceLevel,
									githubUsername
								}
							})
						};
					</script>
				</body>
			</html>
            `;

            panel.webview.onDidReceiveMessage(
                async message => {
                    if (message.command === 'submitProfile') {
						const stringData = Object.fromEntries(
							Object.entries(message.data).map(([key, value]) => [key, String(value)])
						);
						const { firstName, lastName, email, leetcodeId, preferredLanguage, experienceLevel, githubUsername } = stringData;
                        panel.dispose();
                        vscode.window.showInformationMessage(`Welcome to MockMe ${firstName} ${lastName}!`);
						context.globalState.update("firstName", firstName);
						context.globalState.update("lastName", lastName);
						context.globalState.update("email", email);
						context.globalState.update("leetcodeId", leetcodeId);
						context.globalState.update("preferredLanguage", preferredLanguage);
						context.globalState.update("experienceLevel", experienceLevel);
						context.globalState.update("githubUsername", githubUsername);
                    }
                },
                undefined,
                context.subscriptions
            );
        }
    );

	const stats = vscode.commands.registerCommand(
		"mockme.findMyStats",
		async () => {
		const username = context.globalState.get("leetcodeId") as string;

		if (!username) {
			vscode.window.showWarningMessage("No username provided.");
			return;
		}

		vscode.window.withProgress(
			{
			location: vscode.ProgressLocation.Notification,
			title: "Fetching LeetCode stats...",
			cancellable: true,
			},
			async () => {
			const stats = await getData(username);
			if (stats) {
				const lines = [
					`LeetCode Stats for ${stats.username}:`,
					`Ranking: ${stats.ranking}`,
					`Total Solved: ${stats.totalSolved}`,
					`Easy: ${stats.easySolved}`,
					`Medium: ${stats.mediumSolved}`,
					`Hard: ${stats.hardSolved}`,
					`Recent Submissions:`,
					...(stats.recentSubmissions?.slice(0, 10).map(sub =>
						`	${sub.title.padEnd(30)} ${sub.statusDisplay}`
					) || ["None"])
				];
				
				vscode.window.showQuickPick(lines, { placeHolder: "LeetCode Summary" });
			} else {
				vscode.window.showErrorMessage(
				"Could not fetch stats. Please check the username and try again."
				);
			}
			}
		);
		}
	);

	context.subscriptions.push(welcome, stats);
}

export function deactivate() {}
