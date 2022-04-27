//
//  FilterCellCollectionViewCell.swift
//  AustinDrinks
//
//  Created by Austin Faulkner on 3/7/22.
//

import UIKit

// FilterCell is a UICollectionViewCell just like ReviewCell and PhotoCell; this class establishees properties
// of the FilterCell
class FilterCell: UICollectionViewCell {
    
    @IBOutlet var nameLabel: UILabel!
    @IBOutlet var thumbnailImageView: UIImageView!
    override func awakeFromNib() {
        super.awakeFromNib()
        thumbnailImageView.layer.cornerRadius = 9
        thumbnailImageView.layer.masksToBounds = true
    }
}


extension FilterCell: ImageFiltering {
    func set(filterItem: FilterItem, imageForThumbnail: UIImage) {
        nameLabel.text = filterItem.name
        if let filter = filterItem.filter {
            if filter != "None" {
                let filteredImage = apply(filter: filter, originalImage: imageForThumbnail)
                thumbnailImageView.image = filteredImage
            } else {
                thumbnailImageView.image = imageForThumbnail
            }
        }
    }
}
