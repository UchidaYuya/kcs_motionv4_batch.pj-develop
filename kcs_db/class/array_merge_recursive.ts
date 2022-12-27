export const array_merge_recursive = (H_allFileData: any[], H_fileData: any[]) => {
	const arrayMerge = require('../array/array_merge')
	let idx = ''
	if (H_allFileData && Object.prototype.toString.call(H_allFileData) === '[object Array]' &&
	  H_fileData && Object.prototype.toString.call(H_fileData) === '[object Array]') {
	  for (idx in H_fileData) {
		H_allFileData.push(H_fileData[idx])
	  }
	} else if ((H_allFileData && (H_allFileData instanceof Object)) && (H_fileData && (H_fileData instanceof Object))) {
	  for (idx in H_fileData) {
		if (idx in H_allFileData) {
		  if (typeof H_allFileData[idx] === 'object' && typeof H_fileData === 'object') {
			H_allFileData[idx] = arrayMerge(H_allFileData[idx], H_fileData[idx])
		  } else {
			H_allFileData[idx] = H_fileData[idx]
		  }
		} else {
		  H_allFileData[idx] = H_fileData[idx]
		}
	  }
	}
	return H_allFileData
}