# Decision log

## 1. What did you set out to build, and what changed?

I wanted to build a minimalist website that displayed simple info about my public and professional life, including where I go to school, my previous work experience, and social media links. I also wanted to build an interactive graphical portfolio that would walk an end user through my resume in a more interesting format.

Along the way, I dropped the interactive portfolio idea, as I felt that a graphical portfolio would conflict with my idea of maintaining a simple, minimalist website, and I would rather have a central resume that's available to my end users instead of continuously syncing my professional resume and graphical portfolio. I also don't want to reinvent the wheel - I feel as if my resume is a high-level for summary and pretty readable for most users, and end users interested in specific projects contributions can view my GitHub, instead of building a portfolio that requires more upkeep.

Along the way, I felt that my website didn't always express my personal voice, so I added widgets along the way to enhance my personal brand, including the last.fm last played widget.

---

## 2. A fork in the road

Early on in the design process, I considered using a template vs. building the site structure from the ground up. Considering I always had a minimalist goal and structure in mind, I considered that using a template would have me deleting more components and modifying more of the structure versus prompting for the most minimal website presence and building upward from that point. Therefore, I chose to build the site structure from the ground up and use minimal frameworks, sticking to Github Pages' Jekyll generator and plain JS/HTML/CSS.

In not choosing to use a template, I gave up the ability to make easy and simple design decisions i.e. choosing my fonts, colors, or component layouts, but at the end of initial development I felt that my site fit my personal goal more than a template would have.

---

## 3. Where you overruled the agent

I didn't run into much deviation from my personal expectations with Claude Code. Many of the errors I made in my building my website could be attributed to a lack of eye for design. The one issue I had with Claude was when it would replace my own text in commits where I wasn't asking it to do so. One thing I particularly can't stand when people use AI as a driver in their projects is when they include LLM-generated text, which I think is particularly revealing of their attitude around the project. 

One example of this issue happening is when I asked Claude Code to bold the subjects in some of my sentences to place emphasis on schools/places of work/etc. Instead of just adding the tag around those subjects, it modified my entire sentence structure, and then I was left with a paragraph that didn't reflect my own voice. I noticed upon checking the diff after my initial prompt and manual verification via Claude generating design artifacts after every change. Instead of keeping these changes, I restored the file to the previous commit and explicitly instructed Claude to not modify text that I wrote myself. I think specifying these instructions in a project-level steering file would lower the risk of this happening next time.

---

## 4. How you know it works

In my design process, I used Claude Artifacts to verify that the design choices I were implementing looked how I expected, which allowed me to iterate through fast when designing and positioning each component. When finishing my initial site build and verifying the new components rendered correctly on the website. I used a verification prompt (verification/prompt.md) to return the raw HTML structure for the site for each valid page, as well as a screenshot in my local browser environment of what each page looked like.

Pasting the prompt into a new Claude Code session allowed Claude to perform all the steps needed for manual verification, which returned a fetch text file and screenshot for each page. I could then create a new Claude Code session to act as a review agent, inspecting the verification files to make sure my vision was being executed, although for most of the building process I manually inspected the fetch files and screenshot files.

As I potentially add more pages and/or add more interactive blog posts, I can continue to use this verification workflow. Any error in status code and content syntax would result in a fail in the verification check as per the prompt.

---

## 5. What is still wrong

On site load, particularly in new environments, some components are slow to load, including some of my fonts and my last.fm widget. I'd like to figure out how to optimize the load time, particularly because the website is static. I can use Cloudflare metrics as one of multiple tools to help debug this issue.
