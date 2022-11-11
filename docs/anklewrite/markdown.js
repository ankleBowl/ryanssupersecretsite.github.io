var currentChar, inputString, markdownPatterns, patterns, rReturn;

class markdownPattern {
  constructor(pattern) {
    this.pattern = pattern;
    this.loggedStartIndex = false;
    this.textCharInEmpty = false;
    this.tempStartIndex = 0;
    this.tempEndIndex = 0;
    this.currentIndex = 0;
    this.wordsInBlankSpace = [];
    this.wordInBlankSpace = "";
  }

  checkNextCharacterValid(character, index) {
    var patternMatched, result;
    patternMatched = false;

    if (this.pattern[this.currentIndex] === character) {
      this.currentIndex += 1;
      patternMatched = true;
    } else {
      if (this.pattern[this.currentIndex] === "!") {
        if (this.pattern[this.currentIndex + 1] === character && this.textCharInEmpty) {
          this.currentIndex += 2;
          this.textCharInEmpty = false;
          patternMatched = true;
          this.wordsInBlankSpace.push(this.wordInBlankSpace);
          this.wordInBlankSpace = "";
        } else {
          if (this.pattern[this.currentIndex + 1] === character && !this.textCharInEmpty) {
            patternMatched = false;
          } else {
            this.wordInBlankSpace += character;
            this.textCharInEmpty = true;
            patternMatched = true;
          }
        }
      }
    }

    if (this.currentIndex === 1 && !this.loggedStartIndex) {
      this.tempStartIndex = index;
      this.loggedStartIndex = true;
    }

    if (this.pattern.length === this.currentIndex) {
      this.tempEndIndex = index;
      result = new markdownResult(this.tempStartIndex, this.tempEndIndex, this.wordsInBlankSpace, this.pattern);
      this.reset();
      return result;
    }

    if (!patternMatched && this.currentIndex > 0) {
      this.reset();
    }
  }

  reset() {
    this.currentIndex = 0;
    this.textCharInEmpty = false;
    this.tempEndIndex = 0;
    this.loggedStartIndex = false;
    this.wordInBlankSpace = "";
    this.wordsInBlankSpace = [];
  }

}

class markdownResult {
  constructor(startIndex, endIndex, wordsInBlankSpace, pattern) {
    this.startIndex = startIndex;
    this.endIndex = endIndex;
    this.wordsInBlankSpace = wordsInBlankSpace;
    this.pattern = pattern;
  }

  shouldRenderChar(index, character) {
    // Check if the character is in the pattern
    if (index < this.startIndex || index > this.endIndex) {
      return true;
    }
    for (var i = 0; i < this.pattern.length; i++) {
      // console.log("testing against pattern, startindex is " + this.startIndex + " and endindex is " + this.endIndex + ", character " + character + " is at index " + index);
      if (this.pattern[i] == character) {
        // console.log("returned false")
        return false;

      }
    }

    if (this.pattern == "[!](!)") {
      // Don't render anything if it is a link
      return false;
    }
    return true;
  }
}


markdownPatternsToClass = {
  "*!*": "italics",
  "**!**": "bold",
  "[!](!)": "link"
}

function getMarkdownPatterns(input) {
    patterns = [ new markdownPattern("*!*"), new markdownPattern("**!**"), new markdownPattern("[!](!)")];
    markdownPatterns = [];

    for (var x = 0, _pj_a = input.length; x < _pj_a; x += 1) {
        currentChar = input[x];
      
        for (var pattern, _pj_d = 0, _pj_b = patterns, _pj_c = _pj_b.length; _pj_d < _pj_c; _pj_d += 1) {
          pattern = _pj_b[_pj_d];
          rReturn = pattern.checkNextCharacterValid(currentChar, x);
      
          if (rReturn) {
            markdownPatterns.push(rReturn);
          }
        }
      }
    return markdownPatterns;
}

function markdownToHtmlNotVisible(input) {
    var markdownPatterns = getMarkdownPatterns(input);
    var outputString = ""

    for (var x = 0; x < input.length; x++) {
        currentChar = input[x];
        for (var m = 0; m < markdownPatterns.length; m++) {
            if (markdownPatterns[m].startIndex === x + 1) {
                if (markdownPatternsToClass[markdownPatterns[m].pattern] === "link") {
                  // Is a link
                  outputString += "<a href='" + markdownPatterns[m].wordsInBlankSpace[1] + "'>" + markdownPatterns[m].wordsInBlankSpace[0] + "</a>";
                } else {
                  outputString += "<a class='" + markdownPatternsToClass[markdownPatterns[m].pattern] + "'>";
                }
            }
            if (markdownPatterns[m].endIndex === x) {
                outputString += "</a>";
            }
        }

        var shouldRender = true;
        for (var m = 0; m < markdownPatterns.length; m++) {
          if (markdownPatterns[m].shouldRenderChar(x, currentChar) == false) {
            shouldRender = false;
          }
        }
        if (shouldRender) {
          outputString += currentChar;
        }
    }
    console.log("Converted text to markdown")
    return outputString;
}