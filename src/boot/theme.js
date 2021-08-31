// the generation process is a little wonky in terms of file extensions
// I don't want to use a plain .js ending, because I don't want to try loading every file
// nor do I want to invent a new file extension, because I don't want to configure syntax highlighting
// so, here we are, with this strange sequence that snowpack requires
import '../theme/css-utils.css.js.js';
import '../theme/core.css.proxy.js';
import '../theme/typography.css.proxy.js';
import '../theme/variables.css.proxy.js';
import '../theme/colors.css.proxy.js';
import '../../_snowpack/pkg/animate.css.proxy.js';