from re import S


class markdownPattern:
    def __init__(self, pattern):
        self.pattern = pattern;

        self.loggedStartIndex = False
        self.textCharInEmpty = False # Keeps track that at least one text character was found in the !

        self.tempStartIndex = 0
        self.tempEndIndex = 0
        self.currentIndex = 0
        self.wordsInBlankSpace = []
        self.wordInBlankSpace = ""
        pass

    def checkNextCharacterValid(self, character, index):
        patternMatched = False # Defaults to failing the pattern, waits to see if a case is satisfied
        if self.pattern[self.currentIndex] == character: # If the character selected is the input character, satisfy
            # print("Found a character")
            self.currentIndex += 1
            patternMatched = True
        elif self.pattern[self.currentIndex] == '!': # If the parser is currently in blank space
            if self.pattern[self.currentIndex + 1] == character and self.textCharInEmpty: # Checks if the blank space is over, using textCharInEmpty to ensure that there was at least one character in the blank space
                self.currentIndex += 2
                self.textCharInEmpty = False
                patternMatched = True
                # print("Found a character")
                self.wordsInBlankSpace.append(self.wordInBlankSpace)
                self.wordInBlankSpace = ""
            elif self.pattern[self.currentIndex + 1] == character and not self.textCharInEmpty: # Opposite of above, if there was no blank space character, fail the check (ex "*i* vs **")
                # print("Found a character, but there was no character in the blank space (!)")
                patternMatched = False
            else: # For any other letter that doesn't match
                # print("Foound a blank space character")
                self.wordInBlankSpace += character
                self.textCharInEmpty = True
                patternMatched = True
        
        if self.currentIndex == 1 and not self.loggedStartIndex: # Log the start index if not already done
            self.tempStartIndex = index
            self.loggedStartIndex = True
        
        if len(self.pattern) == self.currentIndex: # If the currentIndex is at the end of the pattern, complete the pattern recognition
            self.tempEndIndex = index
            # print("Found pattern " + self.pattern + " starting at " + str(self.tempStartIndex) + " and ending at " + str(self.tempEndIndex))
            # print(str(self.wordsInBlankSpace) + " was contained in blank space")
            result = markdownResult(self.tempStartIndex, self.tempEndIndex, self.wordsInBlankSpace, self.pattern)
            self.reset()
            return result
            
        if not patternMatched and self.currentIndex > 0: # If no case was triggered above and the match failes
            # print("Matching failed, restarting")
            self.reset()
        pass

    def reset(self):
        self.currentIndex = 0
        self.textCharInEmpty = False
        self.tempEndIndex = 0
        self.loggedStartIndex = False
        self.wordInBlankSpace = ""
        self.wordsInBlankSpace = []

class markdownResult:
    def __init__(self, startIndex, endIndex, wordsInBlankSpace, pattern):
        self.startIndex = startIndex
        self.endIndex = endIndex
        self.wordsInBlankSpace = wordsInBlankSpace
        self.pattern = pattern

    def __str__(self):
        return "Found pattern " + self.pattern + " starting at " + str(self.startIndex) + " and ending at " + str(self.endIndex) + "\n" + str(self.wordsInBlankSpace) + " was contained in blank space"
        
patterns = [ markdownPattern("[!](!)"), markdownPattern("*!*"), markdownPattern("**!**") ]

markdownPatterns = []

inputString = "Markdown *is* cool, my **parser** can even handle links like [Test](https://www.google.com)."

for x in range(len(inputString)) :
    currentChar = inputString[x]
    for pattern in patterns:
        # print(str(x) + ": " + currentChar)
        rReturn = pattern.checkNextCharacterValid(currentChar, x)
        if rReturn:
            markdownPatterns.append(rReturn)

for pattern in markdownPatterns:
    print(pattern)
    print("\n")

