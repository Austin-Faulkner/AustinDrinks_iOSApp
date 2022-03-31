//
//  ExploreCell.swift
//  AustinDrinks
//
//  Created by Austin Faulkner on 2/12/22.
//

import UIKit

class ExploreCell: UICollectionViewCell {
   
    @IBOutlet var exploreImageView: UIImageView!
    
    override func awakeFromNib() {
        super.awakeFromNib()
        exploreImageView.layer.cornerRadius = 9
        exploreImageView.layer.masksToBounds = true
    }
}
